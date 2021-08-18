import BaseInput from '@/@common/argon/components/Inputs/BaseInput.vue';
import BaseSelect from '@/@common/argon/components/Inputs/BaseSelect.vue';
import BaseDropdown from '@/@common/argon/components/BaseDropdown.vue';
import Card from '@/@common/argon/components/Cards/Card.vue';
import Modal from '@/@common/argon/components/Modal.vue';
import StatsCard from '@/@common/argon/components/Cards/StatsCard.vue';
import BaseButton from '@/@common/argon/components/BaseButton.vue';
import Badge from '@/@common/argon/components/Badge.vue';
import BaseCheckbox from '@/@common/argon/components/Inputs/BaseCheckbox.vue';
import BaseRadio from "@/@common/argon/components/Inputs/BaseRadio";
import BaseProgress from "@/@common/argon/components/BaseProgress";
import BasePagination from "@/@common/argon/components/BasePagination";
import BaseAlert from "@/@common/argon/components/BaseAlert";
import BaseNav from "@/@common/argon/components/Navbar/BaseNav";
import BaseHeader from '@/@common/argon/components/BaseHeader';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { Input, Tooltip, Popover } from 'element-ui';
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(Vue) {
    Vue.component(Badge.name, Badge);
    Vue.component(BaseAlert.name, BaseAlert);
    Vue.component(BaseButton.name, BaseButton);
    Vue.component(BaseCheckbox.name, BaseCheckbox);
    Vue.component(BaseHeader.name, BaseHeader);
    Vue.component(BaseInput.name, BaseInput);
    Vue.component(BaseSelect.name, BaseSelect);
    Vue.component(BaseDropdown.name, BaseDropdown);
    Vue.component(BaseNav.name, BaseNav);
    Vue.component(BasePagination.name, BasePagination);
    Vue.component(BaseProgress.name, BaseProgress);
    Vue.component(BaseRadio.name, BaseRadio);
    Vue.component(Card.name, Card);
    Vue.component(Modal.name, Modal);
    Vue.component(StatsCard.name, StatsCard);
    Vue.component(Input.name, Input);
    Vue.component('validation-provider', ValidationProvider)
    Vue.component('validation-observer', ValidationObserver)
    Vue.use(Tooltip);
    Vue.use(Popover);
  }
};

export default GlobalComponents;
