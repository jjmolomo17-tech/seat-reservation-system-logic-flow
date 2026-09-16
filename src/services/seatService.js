function getSeatMap() {
  return seats.map((code, index) => {
    if (!code) return { seat: index+1, status: 'available' };
    const hold = holds[code];
    return { seat: index+1, status: hold.confirmed ? 'confirmed' : 'held', email: hold.email };
  });
}
