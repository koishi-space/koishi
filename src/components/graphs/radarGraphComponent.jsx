import React, { Component } from "react";
import Joi from "joi";
import {
  Legend,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Radar,
} from "recharts";

class RadarGraphComponent extends Component {
  validateRadarChart(settingsPayload) {
    const polarAngleAxisSchema = Joi.object({
      dataKey: Joi.string().required(),
    });

    const radialAngleAxisSchema = Joi.object({
      dataKey: Joi.string().required(),
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
    });

    const radarSchema = Joi.object({
      _id: Joi.any(),
      __v: Joi.any(),
      dataKey: Joi.string().required(),
      name: Joi.string().allow("").required(),
      fill: Joi.string()
        .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
        .required(),
      dot: Joi.boolean().required(),
      activeDot: Joi.boolean().required(),
      label: Joi.boolean().required(),
      hide: Joi.boolean().required(),
    });

    const schema = Joi.object({
      polarAngleAxis: polarAngleAxisSchema.required(),
      radialAngleAxis: radialAngleAxisSchema.required(),
      radars: Joi.array().items(radarSchema),
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
        {this.validateRadarChart(settingsPreset) ? (
          <ResponsiveContainer width="80%" height={500}>
            <RadarChart
              data={collectionData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey={settingsPreset.polarAngleAxis.dataKey} />
              <PolarRadiusAxis
                domain={[
                  this.compAxisDomain(
                    settingsPreset.radialAngleAxis.range.from,
                    settingsPreset.radialAngleAxis.range.fromCustom,
                    settingsPreset.radialAngleAxis.dataKey
                  ),
                  this.compAxisDomain(
                    settingsPreset.radialAngleAxis.range.to,
                    settingsPreset.radialAngleAxis.range.toCustom,
                    settingsPreset.radialAngleAxis.dataKey
                  ),
                ]}
              />
              {settingsPreset.radars.map(
                (radar) =>
                  !radar.hide && (
                    <Radar
                      dataKey={radar.dataKey}
                      stroke={radar.fill}
                      fill={radar.fill}
                      fillOpacity={0.6}
                      name={radar.name}
                      dot={radar.dot}
                      activeDot={radar.activeDot}
                      label={radar.label}
                    />
                  )
              )}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <p>Graph settings is incomplete.</p>
        )}
      </React.Fragment>
    );
  }
}

export default RadarGraphComponent;
