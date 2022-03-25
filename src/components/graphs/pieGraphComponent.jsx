import React, { Component } from "react";
import Joi from "joi";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

class PieGraphComponent extends Component {
  state = {
    colors: [],
  };

  componentDidMount() {
    let c = [];
    for (let i = 0; i < this.props.collectionData.length; i++)
      c.push(this.genRandomColor());
    this.setState({ colors: c });
  }

  validatePieChart(settingsPayload) {
    const pieSchema = Joi.object({
      dataKey: Joi.string().required(),
      nameKey: Joi.string().required(),
      fill: Joi.string()
        .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
        .required(),
    });

    const { error } = pieSchema.validate(settingsPayload);
    if (error) console.log(error.details[0].message);
    return error ? false : true;
  }

  genRandomColor() {
    let l = "0123456789ABCDEF";
    let c = "#";
    for (let i = 0; i < 6; i++) c += l[Math.floor(Math.random() * 16)];
    return c;
  }

  render() {
    const { settingsPreset, collectionData, collectionModel } = this.props;

    if (this.validatePieChart(settingsPreset)) {
      let valueColumn = collectionModel.find(
        (x) => x.columnName === settingsPreset.dataKey
      );
      if (valueColumn.dataType === "number") {
        for (let d of collectionData) {
          d[settingsPreset.dataKey] = parseFloat(d[settingsPreset.dataKey]);
        }
      } else {
        return <p>Column of {settingsPreset.dataKey} is not of type number.</p>;
      }
    } else {
      return <p>Graph settings is incomplete.</p>;
    }

    return (
      <React.Fragment>
        <ResponsiveContainer width="80%" height={500}>
          <PieChart height={500} width={500}>
            <Pie
              data={collectionData}
              nameKey={settingsPreset.nameKey}
              dataKey={settingsPreset.dataKey}
              fill={settingsPreset.fill}
              label
            >
              {collectionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={this.state.colors[index % this.state.colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
}

export default PieGraphComponent;
