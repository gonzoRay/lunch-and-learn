<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class SessionForm extends Vue {
  maxTitleLength = 50;
  maxDescLength = 500;

  get validators(): object {
    return {
      title: {
        maxLength: this.maxTitleLength,
        rules: [
          v => !!v || this.$i18n.t('validateRequired', ['Title']).toString(),
          v =>
            v.length <= this.maxTitleLength ||
            this.$i18n
              .t('validateMaxLength', ['Title', this.maxTitleLength])
              .toString()
        ]
      },
      description: {
        maxLength: this.maxDescLength,
        rules: [
          v => !!v || this.$i18n.t('validateRequired', ['Description']).toString(),
          v =>
            v.length <= this.maxDescLength ||
            this.$i18n
              .t('validateMaxLength', ['Description', this.maxDescLength])
              .toString()
        ]
      }
    };
  }
}
</script>

<i18n>
{
  "en": {
    "validateRequired": "{0} is required",
    "validateMaxLength": "{0} must be less than {1} characters"
  }
}
</i18n>