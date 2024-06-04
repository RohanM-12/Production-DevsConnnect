import prisma from "../db/db.config.js";

export const createContributionRequest = async (req, res) => {
  try {
    const result = await prisma.contributionRequests.create({
      data: {
        requesterId: req.body.requesterId,
        postId: req.body.postId,
        status: req.body.status,
        interestDescription: req.body.interestDescription,
        wishesToWorkOn: req.body.wishesToWorkOn,
      },
    });

    res.json({
      status: 200,
      data: result,
      message: "success",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Internal server Error",
      error: error.message,
    });
  }
};

export const updateContributionRequestStatus = async (req, res) => {
  try {
    const { id, requesterId, postId, status } = req.body;
    const doesExist = await prisma.contributionRequests.findUnique({
      where: {
        id: id,
        requesterId: requesterId,
        postId: postId,
      },
    });
    if (!doesExist) {
      return res.json({
        status: 401,
        message: "Request not found for the post",
      });
    }

    const result = await prisma.contributionRequests.update({
      where: {
        id: id,
        requesterId: requesterId,
        postId: postId,
      },
      data: {
        status: status,
      },
    });
    //add the member to the chat room if status is accepted
    let chatRoomUserStatus = 500;
    if (result && status == "Accepted") {
      const chatRoom = await prisma.chatRoom.findUnique({
        where: { postId: parseInt(postId) },
      });
      const res = await prisma.chatRoomMember.create({
        data: {
          userId: requesterId,
          chatRoomId: chatRoom.id,
        },
      });
      if (res) {
        chatRoomUserStatus = 200;
      }
    }
    return res.json({
      status: 200,
      message: "success",
      data: result,
      chatRoomUserStatus: chatRoomUserStatus,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getContributionRequests = async (req, res) => {
  try {
    const { userId } = req.query;
    // console.log(userId);
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },

      include: {
        posts: {
          orderBy: {
            created_at: "asc",
          },
          include: {
            contributionRequests: {
              include: {
                requester: {
                  select: {
                    name: true,
                    collegeName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const contributionRequests = user.posts.flatMap((post) =>
      post.contributionRequests.map((request) => ({
        ...request,
        requesterName: request.requester.name,
        collegeName: request.requester.collegeName,
        postName: post.name,
      }))
    );
    // console.log(contributionRequests);
    res.json({ status: 200, message: "success", data: contributionRequests });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Internal server Error",
      error: error.message,
    });
  }
};

export const getMyContributionRequests = async (req, res) => {
  try {
    const { userId } = req.query;
    const contributionRequests = await prisma.contributionRequests.findMany({
      where: { requesterId: parseInt(userId) },
      include: {
        post: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const modifiedContributionRequests = contributionRequests.map(
      (request) => ({
        id: request.id,
        status: request.status,
        interestDescription: request.interestDescription,
        wishesToWorkOn: request.wishesToWorkOn,
        created_at: request.created_at,
        post: {
          id: request.post.id,
          name: request.post.name,
          description: request.post.description,
          user: request.post.user.name,
        },
      })
    );
    res.json({
      status: 500,
      message: "success",
      data: modifiedContributionRequests,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateContributionRequestRating = async (req, res) => {
  try {
    const { reqId, value } = req.body;
    const result = await prisma.contributionRequests.update({
      where: { id: parseInt(reqId) },
      data: {
        rating: value,
      },
    });
    res.json({
      status: 200,
      message: "success",
      //  data: result,
    });
  } catch (error) {
    res.json({
      status: 200,
      message: "Internal server error cannot update rating",
      error: error.message,
    });
  }
};
