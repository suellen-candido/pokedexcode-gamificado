export function getHouseDefaultImage(houseId: string): string {
  const imageMap: Record<string, string> = {
    gryffindor: '/image/charmander.png', // Fogo
    slytherin: '/image/squirtle.png', // Água
    ravenclaw: '/image/bulbasaur.png', // Planta
    hufflepuff: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/25.png', // Pikachu
  };
  return imageMap[houseId] || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/25.png';
}

export function getHouseInitialImage(houseId: string): string {
  const imageMap: Record<string, string> = {
    gryffindor: '/image/charmander.png',
    slytherin: '/image/squirtle.png',
    ravenclaw: '/image/bulbasaur.png',
    hufflepuff: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/25.png',
  };
  return imageMap[houseId] || '';
}
