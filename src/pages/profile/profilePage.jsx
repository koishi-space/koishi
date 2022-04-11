import React, { Component, Fragment } from "react";
import Spinner from "../../components/common/spinner/spinner";
import Button from "../../components/common/button/button";
import "./profilePage.css";
import { getMyProfile } from "../../services/api/usersService";
import { getJwt } from "../../services/authService";
import {
  getCollectionShareInvites,
  acceptCollectionShare,
  declineCollectionShare,
} from "../../services/api/toolsService";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { toast } from "react-toastify";
import _ from "lodash";
import { CopyToClipboard } from "react-copy-to-clipboard";

class ProfilePage extends Component {
  state = {
    user: {},
    shareInvites: [],
    loading: true,
    notificationsLoading: false,
    tokenCopied: false,
    authToken: getJwt(),
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

  handleGetAuthToken = () => {
    this.setState({ authTokenModalOpened: false });
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
                <CopyToClipboard
                  text={this.state.authToken}
                  onCopy={() => this.setState({ tokenCopied: true })}
                >
                  <Button text="Get my x-auth-token" />
                </CopyToClipboard>
                {this.state.tokenCopied && (
                  <p style={{ color: "#07bc0c" }}>Copied to clipboard!</p>
                )}
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
