import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityStore from "../../../app/stores/activityStore";
import ActivityDetailsChat from './ActivityDetailsChat';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsSidebar from './ActivityDetailsSidebar';

interface DetailsParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailsParams>> = ({ match, history }) => {
  const activityStore = useContext(ActivityStore);
  const { 
    activity, 
    loadActivity, 
    loadingInitial, 
  } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id])

  if (loadingInitial) 
    return <LoadingComponent content="Loading activity..." />

  if (!activity) 
    return <h2>activity not found</h2>

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfo activity={activity} />
        <ActivityDetailsChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailsSidebar />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDetails);
