import prisma from "../db/db.config.js";

export const followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    const result = await prisma.Connections.create({
      data: { followerId: followerId, followingId: followingId },
    });
    res.json({
      status: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    const result = await prisma.delete({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });
  } catch (error) {
    res.json({
      status: 200,
      message: "Internal server Error Cannot unfollow",
      error: error.message,
    });
  }
};
