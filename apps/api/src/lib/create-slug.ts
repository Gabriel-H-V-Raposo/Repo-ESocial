export function createSlug(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .trim() // Remove espaços em volta
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .toLowerCase(); // Converte para minúsculas

  // Se o slug resultante for inválido, gera um ID aleatório
  return slug || createRandomSlug(8);
}

function createRandomSlug(length: number = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
