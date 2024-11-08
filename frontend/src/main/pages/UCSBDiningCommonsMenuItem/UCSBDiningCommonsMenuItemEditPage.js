import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RestaurantEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: UCSBDiningCommonsMenuItem,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbdiningcommonsmenuitem?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsbdiningcommonsmenuitem`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (UCSBDiningCommonsMenuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitem",
    method: "PUT",
    params: {
      id: UCSBDiningCommonsMenuItem.id,
    },
    data: {
      diningCommonsCode: UCSBDiningCommonsMenuItem.diningCommonsCode,
      name: UCSBDiningCommonsMenuItem.name,
      station: UCSBDiningCommonsMenuItem.station,
    },
  });

  const onSuccess = (UCSBDiningCommonsMenuItem) => {
    toast(
      `UCSBDiningCommonsMenuItem Updated - id: ${UCSBDiningCommonsMenuItem.id} ucsbDiningCommonsCode: ${UCSBDiningCommonsMenuItem.diningCommonCode} name: ${UCSBDiningCommonsMenuItem.name} station: ${UCSBDiningCommonsMenuItem.station}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbdiningcommonsmenuitem?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/diningcommonsmenuitem" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Dining Commons Item</h1>
        {UCSBDiningCommonsMenuItem && (
          <UCSBDiningCommonsMenuItemForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={UCSBDiningCommonsMenuItem}
          />
        )}
      </div>
    </BasicLayout>
  );
}
