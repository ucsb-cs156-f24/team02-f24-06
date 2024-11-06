import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBDiningCommonsMenuItemUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBDiningCommonsMenuItemTable({
  UCSBDiningCommonsMenuItem,
  currentUser,
  testIdPrefix = "UCSBDiningCommonsMenuItemTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/ucsbdiningcommonsmenuitem/edit/${cell.row.values.id}`);
  };

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsbdiningcommonsmenuitem/all"],
  );

  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "diningCommonsCode",
      accessor: "diningCommonsCode",
    },
    {
      Header: "name",
      accessor: "name",
    },
    {
      Header: "station",
      accessor: "station",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return (
    <OurTable
      data={UCSBDiningCommonsMenuItem}
      columns={columns}
      testid={testIdPrefix}
    />
  );
}
