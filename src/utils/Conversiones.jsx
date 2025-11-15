// Función para convertir un string a formato Capitalize (primera letra mayúscula, resto minúsculas)
export function ConvertirCapitalize(input) {
  // Toma el primer carácter y lo convierte a mayúscula + toma el resto del string y lo convierte a minúsculas
  return (input.charAt(0).toUpperCase()+input.slice(1).toLowerCase());
}
