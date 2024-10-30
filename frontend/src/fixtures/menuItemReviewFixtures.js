const menuItemReviewFixtures = {
  oneMenuItem: {
    id: 1,
    itemId: 10,
    reviewerEmail: "string@gmail.com",
    stars: 4,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "comments",
  },
  threeMenuItems: [
    {
      id: 1,
      itemId: 10,
      reviewerEmail: "string@gmail.com",
      stars: 4,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "comments",
    },
    {
      id: 2,
      itemId: 11,
      reviewerEmail: "string2@gmail.com",
      stars: 3,
      dateReviewed: "2021-01-02T12:00:00",
      comments: "comments2",
    },
    {
      id: 3,
      itemId: 8,
      reviewerEmail: "string3@gmail.com",
      stars: 1,
      dateReviewed: "2026-01-02T12:00:00",
      comments: "comments3",
    },
  ],
};

export { menuItemReviewFixtures };
