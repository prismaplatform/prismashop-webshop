import { Dialog, Transition, TransitionChild } from "@/app/ui/headlessui";
import { StarIcon } from "@heroicons/react/24/solid";
import ReviewItem from "@/components/layout/ReviewItem/ReviewItem";
import SortOrderFilter from "@/components/layout/SectionGridMoreExplore/SortOrderFilter";
import React, { FC, useEffect, useState } from "react";
import ButtonClose from "@/components/ui/ButtonClose/ButtonClose";
import { ReviewDto } from "@/models/review.model";
import { useTranslations } from "next-intl";

export interface ModalViewAllReviewsProps {
  show: boolean;
  onCloseModalViewAllReviews: () => void;
  reviews: ReviewDto[];
  rating: number;
}

const ModalViewAllReviews: FC<ModalViewAllReviewsProps> = ({
  show,
  onCloseModalViewAllReviews,
  reviews,
  rating,
}) => {
  const [sortOrder, setSortOrder] = useState<string>("Cel mai nou rating");
  const [sortedReviews, setSortedReviews] = useState<ReviewDto[]>(reviews);
  const t = useTranslations("Pages.Products.Reviews");

  // Function to handle sorting based on the selected Ordinea de sortare
  const sortReviews = (order: string) => {
    let sorted = [...reviews];
    switch (order) {
      case "Cel mai nou rating":
        sorted.sort(
          (a, b) =>
            new Date(b.createDate ?? new Date()).getTime() -
            new Date(a.createDate ?? new Date()).getTime()
        );
        break;
      case "Cel mai mare rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "Cel mai mic rating":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    setSortedReviews(sorted);
  };

  // UseEffect to sort reviews whenever the sortOrder changes
  useEffect(() => {
    sortReviews(sortOrder);
  }, [sortOrder, reviews]);

  return (
    <Transition appear show={show}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onCloseModalViewAllReviews}
      >
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </TransitionChild>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block py-8 h-screen w-full max-w-5xl">
              <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-menu-bg-dark border border-primary-500 shadow-xl h-full">
                <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="headlessui-dialog-title-70"
                  >
                    {t("seeAll")}
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={onCloseModalViewAllReviews} />
                  </span>
                </div>
                <div className="px-8 my-5 flex justify-between flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-semibold flex items-center text-menu-text-light">
                    <StarIcon className="w-7 h-7 mb-0.5" />
                    <span className="ml-1.5">
                      {rating} · {reviews.length} {t("reviews")}
                    </span>
                  </h2>
                  <SortOrderFilter
                    className="my-2"
                    data={[
                      { name: t("sortOrder") },
                      { name: t("newestRating") },
                      { name: t("highestRating") },
                      { name: t("lowestRating") },
                    ]}
                    onChange={(value: string) => setSortOrder(value)}
                  />
                </div>
                <div className="px-8 py-8 border-t border-accent-200 dark:border-accent-700 overflow-auto grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
                  {sortedReviews &&
                    sortedReviews.length > 0 &&
                    sortedReviews.map((review, index) => (
                      <ReviewItem
                        key={index}
                        data={{
                          comment: review.review,
                          date: new Date(review.createDate ?? new Date()).toLocaleDateString(
                            "ro-RO",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          ),
                          name: review.name,
                          starPoint: review.rating,
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalViewAllReviews;
