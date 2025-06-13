import {ref} from 'vue'
import {meetApi} from "@/api/meetApi";
import {createGlobalState, createSharedComposable} from "@vueuse/core";

export const useMeetsListStore = createGlobalState(() => {

    const meetsList = ref([])
    const fetchMeetsList = async () => {
        const {data} = await meetApi.getMeetList()

        meetsList.value = data
    }

    return {
        fetchMeetsList,
        meetsList,
    }
})