import React from "react";
import "./viewCollectionPage.css";
import {
  getCollection,
  saveCollectionSettings,
} from "../../../../services/api/collectionsService";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import SettingsIcon from "@mui/icons-material/Settings";
import Select from "../../../../components/common/select/select";
import BarGraphSettingsForm from "../../../../components/forms/barGraphSettingsForm";
import Spinner from "../../../../components/common/spinner/spinner";
import {
  Brush,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Joi from "joi";
import { toast } from "react-toastify";

class ViewCollectionPage extends React.Component {
  state = {
    loading: true,
    collection: "",
    settingsOpened: false,
    graphVariant: "bar",
    graphVariants: [
      { key: "", value: "Select chart variant" },
      { key: "bar", value: "Bar graph" },
      { key: "line", value: "Line graph" },
    ],
  };

  componentDidMount() {
    getCollection(this.props.match.params.id).then(({ data }) => {
      data.data.value = this.simplifyCollectionStruct(data.data.value);
      this.setState({ collection: data, loading: false });
    });
  }

  simplifyCollectionStruct = (payload) => {
    let simplified = new Array();
    let newItem = {};
    for (let x of payload) {
      for (let y of x) {
        newItem[y.column] = y.data;
      }
      simplified.push(newItem);
      newItem = {};
    }
    return simplified;
  };

  handleOpenSettings = () => {
    this.setState({ settingsOpened: true });
  };

  handleCloseSettings = () => {
    this.setState({ settingsOpened: false });
  };

  handleSaveSettings = (newSettings) => {
    let collection = this.state.collection;
    collection.settings.barGraph = newSettings;
    this.setState({ collection });
    this.handleCloseSettings();
    saveCollectionSettings(collection._id, collection.settings).then(() =>
      toast.info("Settings modified")
    );
  };

  // TODO: Implement propper YUP validation
  validateBarChart(settingsPayload) {
    const axisSettingsSchema = Joi.object({
      dataKey: Joi.string().required(),
      type: Joi.string().allow("category", "number").required(),
      hide: Joi.boolean().required(),
      allowDecimals: Joi.boolean().required(),
      allowDataOverflow: Joi.boolean().required(),
      range: Joi.object({
        from: Joi.string()
          .allow("auto", "dataMin", "dataMax", "custom")
          .required(),
        fromCustom: Joi.string().allow("").required(),
        to: Joi.string()
          .allow("auto", "dataMin", "dataMax", "custom")
          .required(),
        toCustom: Joi.string().allow("").required(),
      }).required(),
      label: Joi.string().allow("").required(),
      unit: Joi.string().allow("").required(),
      scale: Joi.string()
        .allow("auto", "linear", "pow", "sqrt", "log")
        .required(),
    });

    const barSchema = Joi.object({
      _id: Joi.any(),
      __v: Joi.any(),
      dataKey: Joi.string().required(),
      fill: Joi.string()
        .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
        .required(),
      unit: Joi.string().allow("").required(),
      name: Joi.string().allow("").required(),
      stackId: Joi.string().allow("").required(),
    });

    const schema = Joi.object({
      xAxis: axisSettingsSchema.required(),
      yAxis: axisSettingsSchema.required(),
      bars: Joi.array().items(barSchema),
    });

    const { error } = schema.validate(settingsPayload);
    return error ? false : true;
  }

  compAxisDomain = (domain, custom, dataKey) => {
    if (domain === "custom") return parseInt(custom);
    if (domain === "dataMax")
      return Math.max.apply(
        Math,
        this.state.collection.data.value.map(function (o) {
          return o[dataKey];
        })
      );
    if (domain === "dataMin")
      return Math.min.apply(
        Math,
        this.state.collection.data.value.map(function (o) {
          return o[dataKey];
        })
      );
    if (domain === "auto") return "auto";
  };

  render() {
    const { settings } = this.state.collection;
    return (
      <div className="view-small-border collection-view">
        {/* Workspace navigation */}
        <WorkspaceNav collectionId={this.props.match.params.id} />

        <div className="collection-view-div">
          {this.state.loading ? (
            <Spinner />
          ) : (
            <div>
              {/* Select graph type */}
              <div>
                <Select
                  options={this.state.graphVariants}
                  textKey="value"
                  valueKey="key"
                  outline
                  noError
                  value={this.state.graphVariant}
                  onChange={(e) =>
                    this.setState({ graphVariant: e.target.value })
                  }
                />
                <SettingsIcon onClick={this.handleOpenSettings} />
              </div>

              {/* Graph section */}
              {!this.state.settingsOpened && (
                <React.Fragment>
                  {/* Bar Graph */}
                  {this.state.graphVariant === "bar" && (
                    <React.Fragment>
                      {this.validateBarChart(
                        this.state.collection.settings.barGraph
                      ) ? (
                        <ResponsiveContainer width="80%" height={500}>
                          <BarChart
                            data={this.state.collection.data.value}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey={settings.barGraph.xAxis.dataKey}
                              type={settings.barGraph.xAxis.type}
                              hide={settings.barGraph.xAxis.hide}
                              allowDecimals={
                                settings.barGraph.xAxis.allowDecimals
                              }
                              label={settings.barGraph.xAxis.label}
                              unit={settings.barGraph.xAxis.unit}
                              scale={settings.barGraph.xAxis.scale}
                              domain={
                                settings.barGraph.xAxis.type === "number"
                                  ? [
                                      this.compAxisDomain(
                                        settings.barGraph.xAxis.range.from,
                                        settings.barGraph.xAxis.range
                                          .fromCustom,
                                        settings.barGraph.xAxis.dataKey
                                      ),
                                      this.compAxisDomain(
                                        settings.barGraph.xAxis.range.to,
                                        settings.barGraph.xAxis.range.toCustom,
                                        settings.barGraph.xAxis.dataKey
                                      ),
                                    ]
                                  : undefined
                              }
                            />
                            <YAxis
                              dataKey={settings.barGraph.yAxis.dataKey}
                              type={settings.barGraph.yAxis.type}
                              hide={settings.barGraph.yAxis.hide}
                              allowDecimals={
                                settings.barGraph.yAxis.allowDecimals
                              }
                              label={settings.barGraph.yAxis.label}
                              unit={settings.barGraph.yAxis.unit}
                              scale={settings.barGraph.yAxis.scale}
                              domain={
                                settings.barGraph.yAxis.type === "number"
                                  ? [
                                      this.compAxisDomain(
                                        settings.barGraph.yAxis.range.from,
                                        settings.barGraph.yAxis.range
                                          .fromCustom,
                                        settings.barGraph.yAxis.dataKey
                                      ),
                                      this.compAxisDomain(
                                        settings.barGraph.yAxis.range.to,
                                        settings.barGraph.yAxis.range.toCustom,
                                        settings.barGraph.yAxis.dataKey
                                      ),
                                    ]
                                  : undefined
                              }
                            />
                            <Brush
                              dataKey={settings.barGraph.xAxis.dataKey}
                              height={30}
                              stroke="#8884d8"
                            />
                            <Tooltip />
                            <Legend />
                            {settings.barGraph.bars.map((bar) => (
                              <Bar
                                dataKey={bar.dataKey}
                                fill={bar.fill}
                                unit={bar.unit}
                                name={bar.name}
                                stackId={bar.stackId}
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p>Bar chart settings is not complete.</p>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}

              {/* Graph settings section */}
              {this.state.settingsOpened && (
                <React.Fragment>
                  {this.state.graphVariant === "bar" && (
                    // Bar graph settings
                    <React.Fragment>
                      <h1>Graph settings</h1>
                      <BarGraphSettingsForm
                        initialCollectionSettings={
                          this.state.collection.settings.barGraph
                        }
                        collectionModel={this.state.collection.model}
                        handleSaveSettings={this.handleSaveSettings}
                        handleCloseSettings={this.handleCloseSettings}
                      />
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ViewCollectionPage;
