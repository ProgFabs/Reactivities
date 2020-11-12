import { action, observable, makeObservable, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import Activities from "../api/agent";
import IActivity from "../models/activity";

configure({enforceActions: "always"});

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  constructor() {
    makeObservable(this);
  }

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try { 
      const activities = await Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
      })
      })
    } catch (error) { 
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingInitial = false;
      })
    }
  }

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await Activities.details(id);
        runInAction(() => {
          this.activity = activity;
          this.loadingInitial = false;
        })
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        })
        console.log(error);
      }
    }
  }

  @action clearActivity = () => {
    this.activity = undefined;
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
      })
    } catch (error) {
        console.log(error)
    } finally {
      runInAction(() => {
        this.submitting = false;
      })
    }
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity; 
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
      })
    }
  }

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string)  => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    
    try {
      await Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      })
    }
  }

  @action openCreateForm = () => {
    this.activity = undefined;
  }

  @action openEditForm = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  }

  @action cancelSelectedActivity = () => {
    this.activity = undefined;
  }

  @action cancelFormOpen = () => {
  }

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  }
}

export default createContext(new ActivityStore());