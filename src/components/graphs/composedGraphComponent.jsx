import React, { Component } from "react";
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

class ComposedGraphComponent extends Component {
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
        this.props.collectionData.map(function (o) {
          return o[dataKey];
        })
      );
    if (domain === "dataMin")
      return Math.min.apply(
        Math,
        this.props.collectionData.map(function (o) {
          return o[dataKey];
        })
      );
    if (domain === "auto") return "auto";
  };

  render() {
    const { settingsPreset, collectionData } = this.props;

    return (
      <React.Fragment>
        {this.validateBarChart(settingsPreset) ? (
          <ResponsiveContainer width="80%" height={500}>
            <ComposedChart
              data={collectionData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={settingsPreset.xAxis.dataKey}
                type={settingsPreset.xAxis.type}
                hide={settingsPreset.xAxis.hide}
                allowDecimals={settingsPreset.xAxis.allowDecimals}
                // label={settingsPreset.xAxis.label}
                // unit={settingsPreset.xAxis.unit}
                scale={settingsPreset.xAxis.scale}
                domain={
                  settingsPreset.xAxis.type === "number"
                    ? [
                        this.compAxisDomain(
                          settingsPreset.xAxis.range.from,
                          settingsPreset.xAxis.range.fromCustom,
                          settingsPreset.xAxis.dataKey
                        ),
                        this.compAxisDomain(
                          settingsPreset.xAxis.range.to,
                          settingsPreset.xAxis.range.toCustom,
                          settingsPreset.xAxis.dataKey
                        ),
                      ]
                    : undefined
                }
              />
              <YAxis
                dataKey={settingsPreset.yAxis.dataKey}
                type={settingsPreset.yAxis.type}
                hide={settingsPreset.yAxis.hide}
                allowDecimals={settingsPreset.yAxis.allowDecimals}
                // label={settingsPreset.yAxis.label}
                // unit={settingsPreset.yAxis.unit}
                scale={settingsPreset.yAxis.scale}
                domain={
                  settingsPreset.yAxis.type === "number"
                    ? [
                        this.compAxisDomain(
                          settingsPreset.yAxis.range.from,
                          settingsPreset.yAxis.range.fromCustom,
                          settingsPreset.yAxis.dataKey
                        ),
                        this.compAxisDomain(
                          settingsPreset.yAxis.range.to,
                          settingsPreset.yAxis.range.toCustom,
                          settingsPreset.yAxis.dataKey
                        ),
                      ]
                    : undefined
                }
              />
              <Brush
                dataKey={settingsPreset.xAxis.dataKey}
                height={30}
                stroke="#8884d8"
              />
              <Tooltip />
              <Legend />
              {settingsPreset.bars.map(
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
              {settingsPreset.lines.map(
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
              {settingsPreset.areas.map(
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
    );
  }
}

export default ComposedGraphComponent;
