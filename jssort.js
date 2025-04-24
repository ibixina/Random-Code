n = [3, 4, 2, 1, 0, 23, 10, 34, 901];

sorted_n = n.sort((a, b) => {
  if (a - b > 0) {
    return 1;
  } else if (a - b < 0) {
    return -1;
  } else {
    return 0;
  }
});

sorted_n = sorted(n, (a, b) => {
  if (a - b > 0) {
    return 1;
  } else if (a - b < 0) {
    return -1;
  } else {
    return 0;
  }
});

bad_sort = n.sort();

console.log(sorted_n);
console.log(bad_sort);
