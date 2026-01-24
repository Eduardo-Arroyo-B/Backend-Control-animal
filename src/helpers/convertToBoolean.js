const convertToBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    throw new Error("Valor no convertible a booleano");
};

export default convertToBoolean;