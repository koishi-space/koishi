import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import DashboardPage from "./dashboard/dashboardPage";
import CreateCollectionPage from "./collection/create/createCollectionPage";
import ViewCollectionPage from "./collection/view/viewCollectionPage";
import EditCollectionPage from "./collection/edit/editCollectionPage";
import CollectionOptionsPage from "./collection/options/collectionOptionsPage";

const AppRouter = () => {
  return (
    <Switch>
      <Route path="/app/dashboard" component={DashboardPage} />
      <Route path="/app/collection/create" exact component={CreateCollectionPage} />
      <Route path="/app/collection/:id/view" component={ViewCollectionPage} />
      <Route path="/app/collection/:id/edit" component={EditCollectionPage} />
      <Route path="/app/collection/:id/options" component={CollectionOptionsPage} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default AppRouter;