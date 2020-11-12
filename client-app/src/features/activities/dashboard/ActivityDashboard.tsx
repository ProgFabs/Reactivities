import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityStore from "../../../app/stores/activityStore";
import LoadingComponent from '../../../app/layout/LoadingComponent';

const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content={"Loading activities..."} />

  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList />
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Activities filter</h2>
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default observer(ActivityDashboard);