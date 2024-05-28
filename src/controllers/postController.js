import prisma from "../db/db.config.js";

export const createPost = async (req, res) => {
  try {
    console.log("Create post", req.body);
    const {
      Title,
      Description,
      gitHubLink,
      deployedLink,
      demoVideoLink,
      technologiesUsed,
      userId,
    } = req.body;
    console.log("FIle", req.file);
    console.log("array", req.body.technologiesUsed);

    const uploadedFile = req.file;
    const thumbnailImgURL = `/uploads/${uploadedFile.filename}`;
    const uploadResult = await prisma.posts.create({
      data: {
        name: Title,
        description: Description,
        gitHubLink: gitHubLink,
        deployedLink: deployedLink,
        demoVideoLink: demoVideoLink,
        technologiesUsed: [...technologiesUsed.split(",")],
        thumbnailImgURL: thumbnailImgURL,
        userId: parseInt(userId),
      },
    });
    if (uploadResult) {
      return res.json({ status: 200, message: "Post uploaded successfully" });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error while uploading post ",
      error: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    // console.log(req.query);
    // if (req?.query?.collage) {
    //   const postsData = await prisma.posts.findMany({
    //     where: {
    //       collage: req.query.userId,
    //     },
    //     orderBy: {
    //       created_at: "asc",
    //     },
    //     include: {
    //       user: {
    //         select: {
    //           name: true,
    //         },
    //       },
    //     },
    //   });
    //   return res.json({
    //     status: 200,
    //     message: "success",
    //     data: postsData,
    //   });
    // }

    if (req?.query?.userId) {
      const postsData = await prisma.posts.findMany({
        where: {
          userId: parseInt(req.query.userId),
        },
        orderBy: {
          created_at: "asc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      const moddifiedPostData = postsData?.map((post) => ({
        ...post,
        user: post.user.name,
      }));
      return res.json({
        status: 200,
        message: "success",
        data: moddifiedPostData,
      });
    }

    const { currentUserId } = req.query;
    if (currentUserId) {
      const postsData = await prisma.posts.findMany({
        orderBy: { created_at: "asc" },
        include: {
          user: { select: { name: true } },
          contributionRequests: {
            where: { requesterId: parseInt(currentUserId) },
            select: { status: true },
          },
        },
      });
      console.log(postsData);
      const moddifiedPostData = postsData?.map((post) => ({
        ...post,
        user: post.user.name,
      }));

      return res.json({
        status: 200,
        message: "success",
        data: moddifiedPostData,
      });
    }
    // console.log("currentUserId", currentUserId);
    const postsData = await prisma.posts.findMany({
      orderBy: { created_at: "asc" },
      include: { user: { select: { name: true } } },
    });
    console.log(postsData);
    const moddifiedPostData = postsData?.map((post) => ({
      ...post,
      user: post.user.name,
    }));

    return res.json({
      status: 200,
      message: "success",
      data: moddifiedPostData,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id: pid } = req.params;

    const postData = await prisma.posts.findUnique({
      where: {
        id: parseInt(pid),
      },
      include: {
        user: {
          select: {
            name: true,
            collegeName: true,
          },
        },
        contributionRequests: {
          where: { postId: parseInt(pid), status: "Accepted" },
          include: {
            requester: { select: { name: true, collegeName: true } },
          },
        },
      },
    });

    const { currentUserId } = req.query;
    if (currentUserId) {
      const postsData = await prisma.posts.findMany({
        orderBy: { created_at: "asc" },
        include: {
          user: { select: { name: true } },
          contributionRequests: {
            where: { requesterId: parseInt(currentUserId) },
            select: { status: true },
          },
        },
      });

      const moddifiedPostData = postsData?.map((post) => ({
        ...post,
        user: post.user.name,
      }));

      return res.json({
        status: 200,
        message: "success",
        data: moddifiedPostData,
      });
    } else {
      return res.json({
        status: 200,
        message: "success",
        data: {
          ...postData,
          user: postData.user.name,
          collegeName: postData.user.collegeName,
        },
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error getting post",
      error: error,
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const resultPostDelete = await prisma.posts.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!resultPostDelete) {
      return res.json({ status: 401, message: "Post not found to delete" });
    }

    return res.json({
      status: 200,
      message: "Post Deleted",
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error deleting post",
      error: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.userID.toString();
    const postId = parseInt(req.body.id);

    let postToLike = await prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });
    if (!postToLike) {
      return res.json({
        status: 404,
        message: "post not found",
      });
    }
    if (postToLike.likes.includes(userId)) {
      return res.json({
        status: "403",
        message: "post already liked",
      });
    }
    const updatedPost = await prisma.posts.update({
      where: {
        id: postId,
      },
      data: {
        likes: [...postToLike.likes, userId],
      },
    });
    res.json({
      status: 200,
      message: "Post liked",
      likesCount: updatedPost.likes.length,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "error while liking a post",
      error: error.message,
    });
  }
};

export const removeLikePost = async (req, res) => {
  try {
    const userID = req.body.userID.toString();
    const postID = parseInt(req.body.id);
    const postToRemoveLike = await prisma.posts.findUnique({
      where: {
        id: postID,
      },
    });

    if (!postToRemoveLike) {
      res.json({
        status: 404,
        message: "Post not Found",
      });
    }
    console.log(postToRemoveLike);
    let updatedLikes = postToRemoveLike?.likes?.filter((id) => id !== userID);
    console.log(updatedLikes);
    const updatedPost = await prisma.posts.update({
      where: {
        id: postID,
      },
      data: {
        likes: updatedLikes,
      },
    });
    res.json({
      status: 200,
      message: "like removed",
      likesCount: updatedPost.likes.length,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "error while liking a post",
      error: error.message,
    });
  }
};

export const getFilteredPosts = async (req, res) => {
  try {
    const { keyword } = req.query;
    const { collegeName } = req.query;
    if (keyword) {
      const posts = await prisma.posts.findMany({
        where: {
          OR: [
            {
              name: {
                contains: keyword,
                mode: "insensitive", // This makes the search case-insensitive
              },
            },
            {
              description: {
                contains: keyword,
                mode: "insensitive",
              },
            },
            {
              technologiesUsed: {
                has: keyword.toUpperCase(),
              },
            },
          ],
        },
        include: {
          contributionRequests: true, // Include contribution requests if needed\
          user: true,
        },
      });
      const modifiedPosts = posts.map((post) => ({
        ...post,
        user: post.user.name,
      }));
      res.json({ status: 200, data: modifiedPosts, message: "success" });
    }
    if (collegeName) {
      const postsData = await prisma.posts.findMany({
        where: {
          user: {
            collegeName: collegeName,
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          gitHubLink: true,
          deployedLink: true,
          demoVideoLink: true,
          thumbnailImgURL: true,
          technologiesUsed: true,
          created_at: true,
          user: {
            select: {
              name: true,
              collegeName: true,
            },
          },
          likes: true,
        },
      });

      const modifiedPostsData = postsData
        .map((post) => ({
          ...post,
          user: post.user.name,
          collegeName: post.user.collegeName,
          numLikes: post.likes.length,
        }))
        .sort((a, b) => b.numLikes - a.numLikes)
        .slice(0, 3);

      return res.json({
        status: 200,
        message: "success",
        data: modifiedPostsData,
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      message: "Internal server error, cannot search",
      error: error.message,
    });
  }
};
