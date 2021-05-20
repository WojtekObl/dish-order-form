import React, { useEffect, useState } from "react";
import "./Form.css";
import { useForm, useWatch } from "react-hook-form";

function Form() {
  const { register, unregister, handleSubmit, control, reset } = useForm();
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");

  const handleOnSubmit = async (inputs) => {
    console.log(inputs);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
      redirect: "follow",
    };

    const response = await fetch(
      "https://frosty-wood-6558.getsandbox.com:443/dishes",
      requestOptions
    );
    console.log("response:", response);
    const data = await response.json();
    switch (response.status) {
      case 400:
        console.log("data", data);
        setErrors({ ...data });
        console.log("error state", errors);
        break;
      case 200:
        setErrors({});
        setSubmitStatus(`order accepted, id: ${data.id}`);
        reset(response);
        break;

      default:
        break;
    }

    console.log("data", data);
  };

  const selectedValue = useWatch({
    control,
    name: "type",
    defaultValue: "pizza",
  });

  useEffect(() => {
    unregister("slices_of_bread");
    unregister("no_of_slices");
    unregister("diameter");
    unregister("spiciness_scale");
  }, [selectedValue]);

  return (
    <div>
      <h1 className="form__tittle">Put your order</h1>
      <p className="form__description">please fill form below...</p>
      <form className="form" onSubmit={handleSubmit(handleOnSubmit)}>
        <label>
          Dish name:
          <input
            {...register("name", {
              required: "field is required",
              maxLength: 20,
            })}
            type="text"
            placeholder="e.g. 'Big Diavola'"
          />
          {/* {errors.name?.type === "required" && `${errors.name?.message}`} */}
        </label>

        <label>
          Preparatiion time:
          <input
            {...register("preparation_time", {
              required: "true",
            })}
            type="time"
            step="1"
            defaultValue="01:00:00"
          />
        </label>
        <label>
          Type of dish: <br />
          <select {...register("type", { required: true })}>
            <option value="pizza">Pizza</option>
            <option value="soup">Soup</option>
            <option value="sandwich">Sandwich</option>
          </select>
        </label>
        {selectedValue === "pizza" ? (
          <div>
            <label>
              Number of slices:
              <input
                {...register("no_of_slices", {
                  required: "true",
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="be resonable :)"
              />
            </label>
            <label>
              Diameter:
              <input
                {...register("diameter", {
                  required: "true",
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="1.0"
                step="0.1"
                placeholder="be reasonable :)"
              />
            </label>
          </div>
        ) : selectedValue === "soup" ? (
          <label>
            Soup spice scale:
            <input
              {...register("spiciness_scale", {
                required: "true",
                valueAsNumber: true,
              })}
              type="number"
              placeholder="from 1 to 10"
            />
            {errors.spiciness_scale && `${errors.spiciness_scale}`}
          </label>
        ) : (
          <label>
            Slices of bread:
            <input
              {...register("slices_of_bread", {
                required: "true",
                valueAsNumber: true,
              })}
              type="number"
              placeholder="be reasonable :)"
            />
          </label>
        )}
        <p className="form__submit-status">{submitStatus}</p>
        <button type="submit" className="form__submit-btn">
          Send form
        </button>
      </form>
    </div>
  );
}

export default Form;
