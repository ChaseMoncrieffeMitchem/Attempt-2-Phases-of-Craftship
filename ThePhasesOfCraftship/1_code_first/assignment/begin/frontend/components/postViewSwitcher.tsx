import React from "react";

export const PostViewSwitcher = () => {
  return (
    <>
      <div className="content-container">
        <div className="posts-view-switcher flex">
          <div className="active">Popular</div>
          <div className="active">New</div>
        </div>

        <div className="posts-list">
          <div className="post-item">
            <div className="post-item-votes">
              <div className="post-item-upvote">
                <img src="assets/arrow.svg" />
              </div>
              <div>5</div>
              <div className="post-item-downvote">
                <img src="assets/arrow.svg" />
              </div>
            </div>
            <div className="post-item-content">
              <div className="post-item-title">First Post</div>
              <div className="post-item-details">
                <div>2 days ago</div>
                <a href="/member/username"> by username </a>
                <div>comments</div>
              </div>
            </div>
          </div>

          <div className="post-item">
            <div className="post-item-votes">
              <div className="post-item-upvote">
                <img src="assets/arrow.svg" />
              </div>
              <div>2</div>
              <div className="post-item-downvote">
                <img src="assets/arrow.svg" />
              </div>
            </div>
            <div className="post-item-content">
              <div className="post-item-title">Second Post!</div>
              <div className="post-item-details">
                <div>1 month ago</div>
                <a href="/member/username"> by username </a>
                <div>3 comments</div>
              </div>
            </div>
          </div>

          <div className="post-item">
            <div className="post-item-votes">
              <div className="post-item-upvote">
                <img src="assets/arrow.svg" />
              </div>
              <div>7</div>
              <div className="post-item-downvote">
                <img src="assets/arrow.svg" />
              </div>
            </div>
            <div className="post-item-content">
              <div className="post-item-title">Why DDD?</div>
              <div className="post-item-details">
                <div>10 days ago</div>
                <a href="/member/username"> by username </a>
                <div>3 comments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
