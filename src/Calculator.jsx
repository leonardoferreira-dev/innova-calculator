import React, { useState, useRef, useEffect } from "react";
import { FaCalculator } from "react-icons/fa";

const Calculator = ({ value, onChange, decimalScale = 2 }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState("0");
  const calculatorRef = useRef(null);

  const handleButtonClick = (buttonValue) => {
    if (buttonValue === "C") {
      setCalculatorValue("0");
    } else if (buttonValue === "=") {
      try {
        const expression = calculatorValue
          .replace(/,/g, ".")
          .replace(/÷/g, "/")
          .replace(/×/g, "*");

        const result = eval(expression);

        console.log("result", result);

        const formattedValue = parseFloat(result).toFixed(2).replace(".", ",");

        setCalculatorValue(formattedValue);
        onChange(formattedValue);
      } catch {
        setCalculatorValue("Erro");
      }
    } else if (buttonValue === "←") {
      setCalculatorValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (buttonValue === ",") {
      setCalculatorValue((prev) => {
        if (!prev.includes(",") && !/[×÷+\-]/.test(prev.slice(-1))) {
          return prev + ",";
        }

        if (/[×÷+\-]/.test(prev.slice(-1))) {
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
    const handleClickOutside = (event) => {
      if (
        calculatorRef.current &&
        !calculatorRef.current.contains(event.target)
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
    const handleKeyDown = (event) => {
      if (!showCalculator) return;

      const keyMap = {
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

  const buttons = [
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
        type="button"
        onClick={() => setShowCalculator(true)}
        className="calculator-button"
        title="Abrir calculadora"
      >
        <FaCalculator color="#000" size={15} />
      </button>

      {showCalculator && (
        <div ref={calculatorRef} className="calculator-modal">
          <div className="calculator-display">{calculatorValue}</div>

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
