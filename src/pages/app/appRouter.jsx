import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import DashboardPage from "./dashboard/dashboardPage";
import CreateCollectionPage from "./collection/create/createCollectionPage";
import ViewCollectionPage from "./collection/view/viewCollectionPage";
import EditCollectionPage from "./collection/edit/editCollectionPage";
import CollectionOptionsPage from "./collection/options/collectionOptionsPage";
import RealtimeSessionPage from "./realtime/realtimeSessionPage";
import NewRealtimeSessionPage from "./realtime/newRealtimeSessionPage";
import CollectionStatsPage from "./collection/stats/collectionStatsPage";
import CollectionActionsPage from "./collection/actions/collectionActionsPage";

const AppRouter = () => {
  return (
    <Switch>
      <Route path="/app/dashboard" component={DashboardPage} />
      <Route path="/app/realtime/create" component={NewRealtimeSessionPage} />
      <Route path="/app/realtime/session" render={(props) => <RealtimeSessionPage {...props} />} />
      <Route path="/app/collection/create" exact component={CreateCollectionPage} />
      <Route path="/app/collection/:id/view" component={ViewCollectionPage} />
      <Route path="/app/collection/:id/stats" component={CollectionStatsPage} />
      <Route path="/app/collection/:id/edit" component={EditCollectionPage} />
      <Route path="/app/collection/:id/options" component={CollectionOptionsPage} />
      <Route path="/app/collection/:id/actions" component={CollectionActionsPage} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default AppRouter;
