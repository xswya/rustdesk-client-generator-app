/**
 * Ordena un array usando el algoritmo quicksort.
 * @param {number[]} arr - Array de números a ordenar.
 * @returns {number[]} - Array ordenado.
 */
function quicksort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quicksort(left), ...middle, ...quicksort(right)];
}

// Exportar para su uso en otros módulos
module.exports = quicksort;
