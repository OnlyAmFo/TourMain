const getUserIdKey = (user) => {
  if (!user) return "guest";
  return user.id || user._id || "guest";
};

export const getWishlistKey = (user) => `wishlist_${getUserIdKey(user)}`;

export const getWishlistItems = (user) => {
  try {
    const stored = localStorage.getItem(getWishlistKey(user));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const isWishlisted = (user, placeId) => {
  if (!placeId) return false;
  const items = getWishlistItems(user);
  return items.some((item) => String(item._id || item.id || item.placeId) === String(placeId));
};

export const toggleWishlistItem = (user, place) => {
  if (!place) return [];

  const key = getWishlistKey(user);
  const items = getWishlistItems(user);
  const placeId = place._id || place.id || place.placeId;

  const filtered = items.filter(
    (item) => String(item._id || item.id || item.placeId) !== String(placeId)
  );

  const nextItems =
    filtered.length === items.length
      ? [
          ...items,
          {
            _id: placeId,
            title: place.title,
            location: place.location,
            description: place.description,
            pricePerDay: place.pricePerDay || place.price || 0,
            image: place.image || place.images?.[0] || place.img || "",
            placeId,
          },
        ]
      : filtered;

  localStorage.setItem(key, JSON.stringify(nextItems));
  return nextItems;
};
