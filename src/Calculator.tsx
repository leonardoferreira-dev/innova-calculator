import React, { useState, useRef, useEffect } from "react";
import { FaCalculator } from "react-icons/fa";

interface CalculatorProps {
  value: string;
  onChange: (value: string) => void;
  decimalScale?: number;
  disabled?: boolean;
}

const Calculator: React.FC<CalculatorProps> = ({
  value,
  onChange,
  decimalScale = 2,
  disabled,
}) => {
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calculatorValue, setCalculatorValue] = useState<string>("0");
  const calculatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!!value && value !== calculatorValue) {
      setCalculatorValue(String(value) || "0");
    }
  }, [value]);

  const handleButtonClick = (buttonValue: string): void => {
    if (
      calculatorValue === "0" ||
      calculatorValue === "0,00" ||
      calculatorValue === "0.00"
    ) {
      if (/[0-9]/.test(buttonValue)) {
        setCalculatorValue(buttonValue);
      } else {
        setCalculatorValue("0");
      }
      return;
    }

    if (buttonValue === "C") {
      setCalculatorValue("0");
    } else if (buttonValue === "=") {
      try {
        const lastChar = calculatorValue.slice(-1);
        if (/[×÷+\-]/.test(lastChar) || lastChar === "=") {
          return;
        }

        const expression = calculatorValue
          .replace(/,/g, ".")
          .replace(/÷/g, "/")
          .replace(/×/g, "*");

        const result = eval(expression);

        const formattedValue = parseFloat(result)
          .toFixed(decimalScale)
          .replace(".", ",");

        setCalculatorValue(formattedValue);
        onChange(formattedValue);
      } catch {
        setCalculatorValue("Erro");
      }
    } else if (buttonValue === "←") {
      setCalculatorValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (buttonValue === ",") {
      setCalculatorValue((prev) => {
        const lastNumber = prev.split(/[×÷+\-]/).pop() as any;
        if (!lastNumber.includes(",")) {
          return prev + ",";
        }
        return prev;
      });
    } else if (/[×÷+\-]/.test(buttonValue)) {
      setCalculatorValue((prev) => {
        if (/[×÷+\-]/.test(prev.slice(-1))) {
          return prev;
        }
        return prev + buttonValue;
      });
    } else {
      setCalculatorValue((prev) =>
        prev === "0" ? buttonValue : prev + buttonValue
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        calculatorRef.current &&
        !calculatorRef.current.contains(event.target as Node)
      ) {
        setShowCalculator(false);
      }
    };

    if (showCalculator) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalculator]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (!showCalculator) return;

      const keyMap: { [key: string]: string } = {
        Backspace: "←",
        Enter: "=",
        "+": "+",
        "-": "-",
        "*": "×",
        "/": "÷",
        ",": ",",
        ".": ",",
        C: "C",
        "=": "=",
      };

      const isNumber = /^[0-9]$/.test(event.key);
      const isOperator = keyMap[event.key];

      if (isNumber) {
        handleButtonClick(event.key);
      } else if (isOperator) {
        handleButtonClick(keyMap[event.key]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCalculator, calculatorValue]);

  const buttons: string[] = [
    "C",
    "←",
    "÷",
    "×",
    "7",
    "8",
    "9",
    "-",
    "4",
    "5",
    "6",
    "+",
    "1",
    "2",
    "3",
    "=",
    "0",
    ",",
  ];

  return (
    <div className="calculator-container">
      <button
        disabled={disabled}
        type="button"
        onClick={() => setShowCalculator(true)}
        className="calculator-button"
        title="Abrir calculadora"
      >
        <FaCalculator color="#000" size={15} />
      </button>

      {showCalculator && (
        <div ref={calculatorRef} className="calculator-modal">
          <div className="calculator-display">
            {calculatorValue.replace(/\./g, ",")}
          </div>
          <div className="calculator-buttons">
            {buttons.map((button, index) => (
              <button
                type="button"
                key={index}
                className={`calculator-button-key ${
                  button === "="
                    ? "equal"
                    : button.match(/[×÷+\-]/)
                    ? "operator"
                    : button === "C" || button === "←"
                    ? "clear"
                    : "number"
                }`}
                onClick={() => handleButtonClick(button)}
              >
                {button}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { Calculator };
