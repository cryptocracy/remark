<template>
  <div>
    <div>
      <!-- <img
        id="sound"
        :src="soundUrl"
        ref="soundUrl"
        height="150"
        @click="onPickFile"
        style="cursor: pointer;"
      > -->
    </div>
    <div>
      <v-btn raised @click="onPickFile" :disabled="disabled" v-if="!soundUrl">
        {{ selectLabel }}
      </v-btn>
      <v-btn raised class="error" @click="removeFile" :disabled="disabled" v-else>
        {{ removeLabel }}
      </v-btn>
      <input
        type="file"
        ref="sound"
        name="sound"
        :accept="accept"
        @change="onFilePicked"
      >
    </div>
  </div>
</template>

<script>
/* import imageCompressor from '../../services/image-compressor' */

export default {
  props: {
    value: {
      type: [Object, File]
    },
    accept: {
      type: String,
      default: '*'
    },
    selectLabel: {
      type: String,
      default: 'Select a MP3'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    removeLabel: {
      type: String,
      default: 'Remove'
    },
    limit: {
      type: [Number, String],
      default: null
    }
  },

  data () {
    return {
      soundUrl: ''
    }
  },

  watch: {
    value (v) {
      if (this.value && this.value.url) {
        this.soundUrl = v.url
      }
    }
  },

  mounted () {
    this.soundUrl = this.value
  },

  methods: {
    onPickFile () {
      this.$refs.sound.click()
    },

    onFilePicked (event) {
      const files = event.target.files || event.dataTransfer.files
      if (files && files[0]) {
        const filename = files[0].name

        if (filename && filename.lastIndexOf('.') <= 0) {
          return // return alert('Please add a valid sound!')
        }

        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.soundUrl = fileReader.result
          /*          this.$refs.soundUrl.addEventListener('load', () => {
            if (files[0].size < this.limit) {
              this.$emit('input', files[0])
            } else {
              // return alert('File size limit exceeded')
              imageCompressor.compress(files[0], this.$refs.soundUrl, 0.8, this.limit)
                .then((newSound) => {
                  this.$emit('input', newSound)
                })
            }
          }) */
        })
        fileReader.readAsDataURL(files[0])
      }
    },

    removeFile () {
      this.soundUrl = ''
      this.$emit('input', null)
    }
  }
}
</script>

<style scoped>
    input[type=file] {
        position: absolute;
        left: -99999px;
    }
</style>
