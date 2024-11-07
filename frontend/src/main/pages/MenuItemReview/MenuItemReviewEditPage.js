import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: menuItem,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/menuitemreview?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/menuitemreview`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (menuItem) => ({
    url: "/api/menuitemreview",
    method: "PUT",
    params: {
      id: menuItem.id,
    },
    data: {
      itemId: menuItem.itemID,
      reviewerEmail: menuItem.reviewerEmail,
      stars: menuItem.stars,
      comments: menuItem.comments,
      dateReviewed: menuItem.dateReviewed,
    },
  });

  const onSuccess = (menuItem) => {
    toast(
      `MenuItemReview Updated - id: ${menuItem.id} reviewerEmail: ${menuItem.reviewerEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreview?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit MenuItemReview</h1>
        {menuItem && (
          <MenuItemReviewForm
            initialContents={menuItem}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
