export const capitalize = (str) => {
    const exceptions = ['de', 'del', 'y', 'en'];
    return str
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index !== 0 && exceptions.includes(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };