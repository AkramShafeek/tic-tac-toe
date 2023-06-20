const winCheck = (matrix) => {
  let i, j;  

  // row check
  for (i = 0; i < 3; i++)
    if (matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2])
      if (matrix[i][0] !== "")
        return matrix[i][0];

  // column check
  for (i = 0; i < 3; i++)
    if (matrix[0][i] === matrix[1][i] && matrix[1][i] === matrix[2][i])
      if (matrix[0][i] !== "")
        return matrix[0][i];

  // diagonal check
  if (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2])
    if (matrix[1][1] !== "")
      return matrix[0][0];

  if (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0])
    if (matrix[1][1] !== "")
      return matrix[0][2];

  for (i = 0; i < 3; i++)
    for (j = 0; j < 3; j++)
      if (matrix[i][j] !== 'X' && matrix[i][j] !== 'O')
        return 'continue';

  return 'draw';
}

export default winCheck;