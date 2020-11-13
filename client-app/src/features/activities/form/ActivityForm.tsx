import React, { useState, useContext, useEffect } from 'react'
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from "react-final-form";
import { v4 as uuid } from "uuid";
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from "revalidate";

const validate = combineValidators({
  title: isRequired({ message: "The activity title is required" }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: "Description needs to be at least 5 characters."})
  )(),
  date: isRequired('Date'),
  time: isRequired('Time'),
  city: isRequired('City'),
  venue: isRequired('Venue'),
})

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const activityStore = useContext(ActivityStore);
  const { 
    createActivity, 
    editActivity, 
    loadActivity,
  } = activityStore;
  
  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(match.params.id) {
      setLoading(true);
      loadActivity(match.params.id).then(
        (activity) => setActivity(new ActivityFormValues(activity))
      ).finally(() => setLoading(false));
    };
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any)  => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm 
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                name="title" 
                placeholder="Title" 
                value={activity.title} 
                component={TextInput}
                />
                <Field
                placeholder="Description" 
                name="description" 
                value={activity.description} 
                component={TextAreaInput}
                />
                <Field 
                placeholder="Category" 
                options={category}
                name="category" 
                value={activity.category} 
                component={SelectInput}
                />
                <Form.Group widths="equal">
                <Field 
                placeholder="Date" 
                name="date" 
                date={true}
                value={activity.date} 
                component={DateInput}
                />
                <Field 
                placeholder="Time" 
                name="time" 
                time={true}
                value={activity.time} 
                component={DateInput}
                />
                </Form.Group>
                <Field 
                placeholder="City" 
                name="city" 
                value={activity.city} 
                component={TextInput}
                />
                <Field 
                placeholder="Venue" 
                name="venue" 
                value={activity.venue} 
                component={TextInput}
                />
                <Button 
                loading={activityStore.submitting} 
                disabled={loading || invalid || pristine}
                floated="right" 
                positive 
                type="submit" 
                content="Submit" 
                />
                <Button 
                disabled={loading}
                onClick={
                  activity.id 
                  ? () => history.push(`/activities/${activity.id}`) 
                  : () => history.push('/activities')
                } 
                floated="right" 
                type="button" 
                content="Cancel" 
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default ActivityForm;