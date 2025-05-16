"use client";

import React from "react";
import Heading from "../Heading";

import { Rating } from "@mui/material";
import moment from "moment";
import Avatar from "../Avatar";

interface ListRatingProps {
  Product: any; // Ideally, replace `any` with a proper TypeScript type for the product
}

const ListRating: React.FC<ListRatingProps> = ({ Product }) => {
  return (
    <div>
      <Heading title="Product review" />
      <div className="text-sm mt-2">
        {Product.reviews && Product.reviews.map((review: any) => {
          return (
            <div key={review.id} className="max-w-[300px]">
              <div className="flex gap-2 items-center">
                <Avatar src={review?.user.image} />
                <div className="font-semibold">{review?.user.name}</div>
                <div className="font-light">{moment(review.createdDate).fromNow()}</div>
              </div>
              <div className="mt-2">
                <Rating value={review.rating} readOnly />
                <div className="ml-2">{review.comment}</div>
                <hr className="mt-4 mb-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListRating;