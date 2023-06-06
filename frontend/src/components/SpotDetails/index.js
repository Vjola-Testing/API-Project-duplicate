import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { spotDetailThunk } from "../../store/spot";
import { spotReviewsThunk } from "../../store/review";
import { useParams } from "react-router-dom";
import "./SpotDetails.css";

export default function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spot.singleSpot);
  const reviews = useSelector((state) => state.review.reviews);
  console.log(reviews);

  useEffect(() => {
    dispatch(spotDetailThunk(spotId));
  }, [dispatch]);

  useEffect(() => {
    dispatch(spotReviewsThunk(spotId));
  }, [dispatch]);

  if (!spot) {
    return <div>Loading Spot...</div>;
  }

  if (!reviews) {
    return <div>Loading Reviews...</div>;
  }

  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };

  return (
    <div className="spot-container">
      <div className="name"> {spot.name}</div>
      <div className="location">
        {" "}
        {spot.city}, {spot.state}, {spot.country}{" "}
      </div>
      <div className="images">
        <div className="preview-image">
          <img
            src={spot.spotImages.find((image) => image.preview).url}
            alt="Preview Image of Spot"
          />
        </div>
        <div className="other-images">
          {spot.spotImages
            .filter((image) => !image.preview)
            .map((image) => (
              <img key={image.id} src={image.url} alt="Image of spot" />
            ))}
        </div>
      </div>
      <div className="belowImages">
        <div className="belowImages-info">
          <div className="hostInfo">
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}{" "}
          </div>
          <div className="description"> {spot.description}</div>
        </div>
        <div className="reserve-container">
          <div className="price-reviews">
            <div className="price">${spot.price} night</div>
            <div className="reviews">
              <div className="starRating">
                <i className="fa-solid fa-star"></i>
                {spot.avgStarRating}
              </div>
              <div className="reviewCount">{spot.numReviews} reviews</div>
            </div>
          </div>
          <button className="reserveButton" onClick={handleReserveClick}>
            Reserve Now
          </button>
        </div>
      </div>
      <div className="reviewsContainer">
      <div className="mainReviews">
              <div className="starRating">
                <i className="fa-solid fa-star"></i>
                {spot.avgStarRating}
              </div>
              <div className="reviewCount">{spot.numReviews} reviews</div>
            </div>
        {reviews &&
          reviews.map((review) => (
            <div className="individualReview" key={`review-${review.id}`}>
              <div className="reviewUser">{review.User.firstName}</div>
              <div className="createdAt">{review.createdAt}</div>
              <div className="reviewDescription">{review.review}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
