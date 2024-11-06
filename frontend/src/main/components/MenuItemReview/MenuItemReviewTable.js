import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/MenuItemReviewUtils"; //prob gotta delete this/change it to MenuItemReview
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MenuItemReviewTable({ menuitemreview, currentUser }) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/menuitemreview/edit/${cell.row.values.id}`); 
    };

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/menuitemreview/all"],
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
          Header: "Reviewer Email",
          accessor: "reviewerEmail",
        },
        {
          Header: "ItemID",
          accessor: "itemId",
        },
        {
          Header: "Stars",
          accessor: "stars",
        },
        {
            Header: "Date",
            accessor: "dateReviewed",
        },
        {
            Header: "Comments",
            accessor: "comments",
        }
      ];

      if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(
          ButtonColumn("Edit", "primary", editCallback, "MenuItemReviewTable"),
        );
        columns.push(
          ButtonColumn("Delete", "danger", deleteCallback, "MenuItemReviewTable"),
        );
      }
    
      return <OurTable data={menuitemreview} columns={columns} testid={"MenuItemReviewTable"} />;

}