const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "test@ucsb.edu",
    teamId: "f24-5pm",
    tableOrBreakoutRoom: "6",
    requestTime: "2022-01-02T12:00:00",
    explanation: "explain",
    solved: "true",
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "test1@ucsb.edu",
      teamId: "f24-5pm-1",
      tableOrBreakoutRoom: "6",
      requestTime: "2022-01-02T12:00:00",
      explanation: "explain1",
      solved: "true",
    },
    {
      id: 2,
      requesterEmail: "test2@ucsb.edu",
      teamId: "f24-5pm-2",
      tableOrBreakoutRoom: "6",
      requestTime: "2022-01-02T12:00:00",
      explanation: "explain2",
      solved: "true",
    },
    {
      id: 3,
      requesterEmail: "test3@ucsb.edu",
      teamId: "f24-5pm-3",
      tableOrBreakoutRoom: "6",
      requestTime: "2022-01-02T12:00:00",
      explanation: "explain3",
      solved: "true",
    },
  ],
};

export { helpRequestFixtures };
