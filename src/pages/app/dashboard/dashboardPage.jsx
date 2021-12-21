import React from "react";
import "./dashboardPage.css";
import auth from "../../../services/authService";
import CreateCollectionCard from "../../../components/collectionCard/create/createCollectionCard";

class DashboardPage extends React.Component {
    state = {
        user: "",
    }

    componentDidMount() {
        const user = auth.getCurrentUser();
        this.setState({user});
    }

    render() {
        const { user } = this.state;

        return (
           <div className="app">
               <h1>Welcome back, <span>{user.name}</span>!</h1>
               <div className="app-cards">
                   <CreateCollectionCard />
               </div>
           </div>
        );
    }

}

export default DashboardPage;