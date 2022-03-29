import React, { Component, Fragment } from "react";
import Spinner from "../../components/common/spinner/spinner";
import "./profilePage.css";
import { getMyProfile } from "../../services/api/usersService";
import {
  getCollectionShareInvites,
  acceptCollectionShare,
  declineCollectionShare,
} from "../../services/api/toolsService";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { toast } from "react-toastify";
import _ from "lodash";

class ProfilePage extends Component {
  state = {
    user: {},
    shareInvites: [],
    loading: true,
    notificationsLoading: false,
  };

  componentDidMount() {
    getMyProfile().then(({ data: user }) => {
      getCollectionShareInvites().then(({ data: shareInvites }) => {
        this.setState({ user, shareInvites, loading: false });
      });
    });
  }

  handleAcceptShare = async (token) => {
    this.setState({ notificationsLoading: true });
    try {
      await acceptCollectionShare(token);
      let shares = this.state.shareInvites;
      _.remove(shares, (x) => x._id === token);
      this.setState({ shareInvites: shares });
      toast.success("Share invite accepted");
    } catch (e) {
      toast.error("Oops, something went wrong...");
    } finally {
      this.setState({ notificationsLoading: false });
    }
  };

  handleDeclineShare = async (token) => {
    this.setState({ notificationsLoading: true });
    try {
      await declineCollectionShare(token);
      let shares = this.state.shareInvites;
      _.remove(shares, (x) => x._id === token);
      this.setState({ shareInvites: shares });
      toast.warning("Share invite declined");
    } catch (e) {
      toast.error("Oops, something went wrong...");
    } finally {
      this.setState({ notificationsLoading: false });
    }
  };

  render() {
    const { user, shareInvites } = this.state;
    return (
      <div className="view-small-border profile-page">
        {this.state.loading ? (
          <Spinner />
        ) : (
          <Fragment>
            <div className="profile-page-content-div">
              <h1>My profile</h1>
              <Fragment>
                <h2>{user.name}</h2>
                <h3>{user.email}</h3>
              </Fragment>
            </div>
            <div className="profile-page-content-div">
              <h1>Notifications</h1>
              {this.state.notificationsLoading ? (
                <Spinner />
              ) : (
                <React.Fragment>
                  {shareInvites.map((invite) => (
                    <div
                      key={invite._id}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <p>{invite.purpose}</p>
                      <DoneRoundedIcon
                        className="profile-page-share-button c-success ml10"
                        onClick={() => this.handleAcceptShare(invite._id)}
                      />
                      <DeleteIcon
                        className="profile-page-share-button c-danger ml10"
                        onClick={() => this.handleDeclineShare(invite._id)}
                      />
                    </div>
                  ))}
                </React.Fragment>
              )}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default ProfilePage;
