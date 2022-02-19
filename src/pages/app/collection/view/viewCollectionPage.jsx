import React from "react";
import "./viewCollectionPage.css";
import {
  getCollection,
  saveCollectionSettings,
  newCollectionSettings,
} from "../../../../services/api/collectionsService";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import SettingsIcon from "@mui/icons-material/Settings";
import Select from "../../../../components/common/select/select";
import ComposedGraphSettingsForm from "../../../../components/forms/composedGraphSettingsForm";
import Spinner from "../../../../components/common/spinner/spinner";
import Button from "../../../../components/common/button/button";
import {
  Brush,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";
import Joi from "joi";
import { toast } from "react-toastify";

class ViewCollectionPage extends React.Component {
  state = {
    loading: true,
    collection: "",
    settingsOpened: false,
    graphVariant: "composed",
    selectedSettingsPreset: "",
    graphVariants: [
      { key: "", value: "Select chart variant" },
      { key: "composed", value: "Composed graph" },
    ],
  };

  componentDidMount() {
    getCollection(this.props.match.params.id).then(({ data }) => {
      data.data.value = this.simplifyCollectionStruct(data.data.value);
      this.setState({
        collection: data,
        loading: false,
        selectedSettingsPreset: data.settings[0]._id,
      });
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

  handleCreateNewSettings = () => {
    newCollectionSettings(this.state.collection._id).then(({data}) => {
      let collection = this.state.collection;
      collection.settings.push(data);
      this.setState({collection, selectedSettingsPreset: data._id});
      toast.info("Created new settings preset");
    });
  }

  handleSaveSettings = (newSettings) => {
    const {selectedSettingsPreset} = this.state;
    let collection = this.state.collection;
    for (let s of collection.settings)
      if (s._id === selectedSettingsPreset) {
        s.composedGraph = newSettings;
        break;
      }

    this.setState({ collection });
    this.handleCloseSettings();
    saveCollectionSettings(collection._id, selectedSettingsPreset, collection.settings.find(s => s._id === selectedSettingsPreset)).then(() =>
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
      dataKey: Joi.string().allow("").required(),
      fill: Joi.string()
        .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
        .required(),
      unit: Joi.string().allow("").required(),
      name: Joi.string().allow("").required(),
      stackId: Joi.string().allow("").required(),
      hide: Joi.boolean().required(),
    });

    const lineSchema = Joi.object({
      _id: Joi.any(),
      __v: Joi.any(),
      dataKey: Joi.string().allow("").required(),
      lineType: Joi.string()
        .allow(
          "basis",
          "basisClosed",
          "basisOpen",
          "linear",
          "linearClosed",
          "natural",
          "monotone",
          "monotoneX",
          "monotoneY",
          "step",
          "stepBefore",
          "stepAfter"
        )
        .required(),
      stroke: Joi.string()
        .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
        .required(),
      dot: Joi.boolean().required(),
      activeDot: Joi.boolean().required(),
      label: Joi.boolean().required(),
      strokeWidth: Joi.number().min(1).max(20).required(),
      connectNulls: Joi.boolean().required(),
      unit: Joi.string().allow("").required(),
      name: Joi.string().allow("").required(),
      hide: Joi.boolean().required(),
    });

    const areaSchema = Joi.object({
      _id: Joi.any(),
      __v: Joi.any(),
      dataKey: Joi.string().allow("").required(),
      lineType: Joi.string()
        .allow(
          "basis",
          "basisClosed",
          "basisOpen",
          "linear",
          "linearClosed",
          "natural",
          "monotone",
          "monotoneX",
          "monotoneY",
          "step",
          "stepBefore",
          "stepAfter"
        )
        .required(),
      stroke: Joi.string()
        .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
        .allow("")
        .required(),
      dot: Joi.boolean().required(),
      activeDot: Joi.boolean().required(),
      label: Joi.boolean().required(),
      connectNulls: Joi.boolean().required(),
      unit: Joi.string().allow("").required(),
      name: Joi.string().allow("").required(),
      stackId: Joi.string().allow("").required(),
      hide: Joi.boolean().required(),
    });

    const schema = Joi.object({
      xAxis: axisSettingsSchema.required(),
      yAxis: axisSettingsSchema.required(),
      bars: Joi.array().items(barSchema),
      lines: Joi.array().items(lineSchema),
      areas: Joi.array().items(areaSchema),
    }).required();

    const { error } = schema.validate(settingsPayload);
    if (error) console.log(error.details[0].message);
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
    let settings;
    if (!this.state.loading && this.state.selectedSettingsPreset !== "")
      settings = this.state.collection.settings.find(
        (p) => p._id === this.state.selectedSettingsPreset
      );
    return (
      <div className="view-small-border collection-view">
        {/* Workspace navigation */}
        <WorkspaceNav collectionId={this.props.match.params.id} />

        <div className="collection-view-div">
          {this.state.loading ? (
            <Spinner />
          ) : (
            <div>
              {/* Select settings preset */}
              <div
                className="mb10"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                }}
              >
                {this.state.collection.settings.length === 0 ? (
                  <p>There are no collection presets. Create one!</p>
                ) : (
                  <Select
                    options={this.state.collection.settings.map((p) => {
                      return { value: p._id, text: p.name };
                    })}
                    textKey="text"
                    valueKey="value"
                    outline
                    noError
                    value={this.state.selectedSettingsPreset}
                    onChange={(e) =>
                      this.setState({ selectedSettingsPreset: e.target.value })
                    }
                  />
                )}
                <Button text="+" classes={["ml10"]} onClick={this.handleCreateNewSettings} />
              </div>

              {/* Select graph type */}
              {this.state.selectedSettingsPreset.length > 0 && (
                <div className="graph-selection">
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
              )}

              {/* Graph section */}
              {!this.state.settingsOpened &&
                this.state.selectedSettingsPreset.length > 0 && (
                  <React.Fragment>
                    {/* Bar Graph */}
                    {this.state.graphVariant === "composed" && (
                      <React.Fragment>
                        {this.validateBarChart(
                          this.state.collection.settings.find(
                            (x) => x._id === this.state.selectedSettingsPreset
                          ).composedGraph
                        ) ? (
                          <ResponsiveContainer width="80%" height={500}>
                            <ComposedChart
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
                                dataKey={settings.composedGraph.xAxis.dataKey}
                                type={settings.composedGraph.xAxis.type}
                                hide={settings.composedGraph.xAxis.hide}
                                allowDecimals={
                                  settings.composedGraph.xAxis.allowDecimals
                                }
                                // label={settings.composedGraph.xAxis.label}
                                // unit={settings.composedGraph.xAxis.unit}
                                scale={settings.composedGraph.xAxis.scale}
                                domain={
                                  settings.composedGraph.xAxis.type === "number"
                                    ? [
                                        this.compAxisDomain(
                                          settings.composedGraph.xAxis.range
                                            .from,
                                          settings.composedGraph.xAxis.range
                                            .fromCustom,
                                          settings.composedGraph.xAxis.dataKey
                                        ),
                                        this.compAxisDomain(
                                          settings.composedGraph.xAxis.range.to,
                                          settings.composedGraph.xAxis.range
                                            .toCustom,
                                          settings.composedGraph.xAxis.dataKey
                                        ),
                                      ]
                                    : undefined
                                }
                              />
                              <YAxis
                                dataKey={settings.composedGraph.yAxis.dataKey}
                                type={settings.composedGraph.yAxis.type}
                                hide={settings.composedGraph.yAxis.hide}
                                allowDecimals={
                                  settings.composedGraph.yAxis.allowDecimals
                                }
                                // label={settings.composedGraph.yAxis.label}
                                // unit={settings.composedGraph.yAxis.unit}
                                scale={settings.composedGraph.yAxis.scale}
                                domain={
                                  settings.composedGraph.yAxis.type === "number"
                                    ? [
                                        this.compAxisDomain(
                                          settings.composedGraph.yAxis.range
                                            .from,
                                          settings.composedGraph.yAxis.range
                                            .fromCustom,
                                          settings.composedGraph.yAxis.dataKey
                                        ),
                                        this.compAxisDomain(
                                          settings.composedGraph.yAxis.range.to,
                                          settings.composedGraph.yAxis.range
                                            .toCustom,
                                          settings.composedGraph.yAxis.dataKey
                                        ),
                                      ]
                                    : undefined
                                }
                              />
                              <Brush
                                dataKey={settings.composedGraph.xAxis.dataKey}
                                height={30}
                                stroke="#8884d8"
                              />
                              <Tooltip />
                              <Legend />
                              {settings.composedGraph.bars.map(
                                (bar) =>
                                  !bar.hide && (
                                    <Bar
                                      dataKey={bar.dataKey}
                                      fill={bar.fill}
                                      unit={bar.unit}
                                      name={bar.name}
                                      stackId={bar.stackId}
                                    />
                                  )
                              )}
                              {settings.composedGraph.lines.map(
                                (line) =>
                                  !line.hide && (
                                    <Line
                                      dataKey={line.dataKey}
                                      type={line.lineType}
                                      stroke={line.stroke}
                                      dot={line.dot}
                                      activeDot={line.activeDot}
                                      label={line.label}
                                      strokeWidth={line.strokeWidth}
                                      connectNulls={line.connectNulls}
                                      unit={line.unit}
                                      name={line.name}
                                      hide={line.hide}
                                    />
                                  )
                              )}
                              {settings.composedGraph.areas.map(
                                (area) =>
                                  !area.hide && (
                                    <Area
                                      dataKey={area.dataKey}
                                      type={area.lineType}
                                      stroke={area.stroke}
                                      dot={area.dot}
                                      activeDot={area.activeDot}
                                      label={area.label}
                                      connectNulls={area.connectNulls}
                                      unit={area.unit}
                                      name={area.name}
                                      stackId={area.stackId}
                                      hide={area.hide}
                                    />
                                  )
                              )}
                            </ComposedChart>
                          </ResponsiveContainer>
                        ) : (
                          <p>Graph settings is incomplete.</p>
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}

              {/* Graph settings section */}
              {this.state.settingsOpened && (
                <React.Fragment>
                  {this.state.graphVariant === "composed" && (
                    // Bar graph settings
                    <React.Fragment>
                      <h1>Graph settings</h1>
                      <ComposedGraphSettingsForm
                        initialCollectionSettings={
                          this.state.collection.settings.find(
                            (s) => s._id === this.state.selectedSettingsPreset
                          ).composedGraph
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
