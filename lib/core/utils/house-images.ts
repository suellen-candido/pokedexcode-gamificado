export function getHouseDefaultImage(houseId: string): string {
  const imageMap: Record<string, string> = {
    fogo: '/image/charmander.png', // Fogo
    agua: '/image/squirtle.png', // Água
    planta: '/image/bulbasaur.png', // Planta
  };
  return imageMap[houseId] || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/25.png';
}

export function getHouseInitialImage(houseId: string): string {
  const imageMap: Record<string, string> = {
    fogo: '/image/charmander.png',
    agua: '/image/squirtle.png',
    planta: '/image/bulbasaur.png',
  };
  return imageMap[houseId] || '';
}
