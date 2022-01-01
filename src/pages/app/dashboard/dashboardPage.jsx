import React from "react";
import "./dashboardPage.css";
import auth from "../../../services/authService";
import {getCollections} from "../../../services/api/collectionsService";
import CreateCollectionCard from "../../../components/collectionCard/create/createCollectionCard";
import CollectionCard from "../../../components/collectionCard/collectionCard";
class DashboardPage extends React.Component {
    state = {
        user: "",
        collections: [],
    }

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({user});
        getCollections().then(res => this.setState({collections: res.data}));
    }

    render() {
        const { user, collections } = this.state;

        return (
           <div className="app">
               <h1>Welcome back, <span>{user.name}</span>!</h1>
               <div className="app-cards">
                   <CreateCollectionCard />
                   {collections.map((collection) => <CollectionCard collection={collection} />)}
               </div>
           </div>
        );
    }

}

export default DashboardPage;