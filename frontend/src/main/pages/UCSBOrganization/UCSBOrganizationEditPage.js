import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: ucsbOrganization,
    error: _error,
    status: _status,
  } = useBackend(
    // This key should include the unique parameter for caching purposes
    [`/api/ucsborganizations`, { orgCode: id }],
    {
      method: "GET",
      url: `/api/ucsborganizations`,
      params: { orgCode: id },  // Ensure orgCode is passed here in params
    },
  );

  const objectToAxiosPutParams = (ucsbOrganization) => ({
    url: "/api/ucsborganizations",
    method: "PUT",
    params: {
      orgCode: ucsbOrganization.orgCode,
    },
    data: {
      orgCode: ucsbOrganization.orgCode,
      orgTranslationShort: ucsbOrganization.orgTranslationShort,
      orgTranslation: ucsbOrganization.orgTranslation,
      inactive: ucsbOrganization.inactive, // === "true" || ucsbOrganization.inactive === true, // Ensure boolean
    },
  });

  const onSuccess = (ucsbOrganization) => {
    toast(`UCSB Organization Updated - orgCode: ${ucsbOrganization.orgCode}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    [`/api/ucsborganizations?orgCode=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSB Organization</h1>
        {ucsbOrganization && (
          <UCSBOrganizationForm 
            initialContents={ucsbOrganization} 
            submitAction={onSubmit} 
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
