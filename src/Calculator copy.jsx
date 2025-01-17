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
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setShowCalculator(true)}
        className="flex items-center justify-center rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
        title="Abrir calculadora"
      >
        <FaCalculator color="#000" size={15} />
      </button>

      {showCalculator && (
        <div
          ref={calculatorRef}
          style={{ background: "#2E3851" }}
          className="absolute z-50 bg-gray-200 border rounded shadow-lg p-4 top-12 left-0 w-72"
        >
          <div
            style={{ background: "#212B44", color: "#29CDA8" }}
            className="text-right p-3 rounded mb-3 text-2xl font-semibold border shadow-sm"
          >
            {calculatorValue}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {buttons.map((button, index) => (
              <button
                type="button"
                key={index}
                className={`${
                  button === "="
                    ? "col-span-1 bg-green-new text-white border border-green-new"
                    : button.match(/[×÷+\-]/)
                    ? "bg-orange-300 text-green-new border border-orange-400"
                    : button === "C" || button === "←"
                    ? "bg-gray-300 text-green-new border border-gray-400"
                    : "bg-gray-200 text-white border border-gray-300"
                } py-2 rounded text-lg font-medium hover:bg-gray-400 focus:ring focus:ring-orange-200`}
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
