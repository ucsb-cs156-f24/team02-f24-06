import React from "react";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { ucsbDiningCommonsMenuItemFixtures} from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable",
  component: UCSBDiningCommonsMenuItemTable,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
    UCSBDiningCommonsMenuItem: [],
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsUser = Template.bind({});

ThreeItemsUser.args = {
    UCSBDiningCommonsMenuItem: ucsbDiningCommonsMenuItemFixtures.threeItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdmin = Template.bind({});
ThreeItemsAdmin.args = {
    UCSBDiningCommonsMenuItem:  ucsbDiningCommonsMenuItemFixtures.threeItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdmin.parameters = {
  msw: [
    http.delete("/api/ucsbdiningcommonsmenuitem/", () => {
      return HttpResponse.json(
        { message: "UCSBDiningCommonsMenuItem deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
