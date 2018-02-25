<template>
    <Upload ref="upload" 
        :action="uploadPath" 
        :show-upload-list="showUploadList" 
        :default-file-list="defaultList"
        :on-success="uploadSuccess" 
        :on-error="uploadError" 
        :on-remove="removeList" 
        :max-size="102400" 
        :on-exceeded-size="handleMaxSize" 
        :format="['jpg','jpeg','png','MP4','MP3']"  
        :on-format-error="handleFormatError"
        :multiple="multiple">
        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
        <!-- 自定义显示，如已上传附件 -->
        <slot></slot>
    </Upload>
</template>

<script>
export default {
  props: {
    // 已上传文件list, [{ name: '', url: '' },...]
    defaultList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // true为多附件上传且 选择文件时可以选择多个文件，false为单附件上传
    multiple: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 上传成功回调函数
    uploadCallback: {
      type: Function,
      default: function () {
      }
    },
    index: {
      type: Number,
      default: function () {
        return null
      }
    },
    // 是否显示已上传list
    showUploadList: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    uploadPath: {
      get: function () {
        return this.$store.state.Public.uploadPath
      }
    }
  },
  methods: {
    uploadSuccess (res, file) {
      var path = res.data
      var name = file.name
      // 如果是单附件上传，则先清空现有上传数据
      if (!this.multiple) {
        this.$refs.upload.clearFiles()
        this.$refs.upload.fileList.push(file)
      } else {
        // 多个附件时拼接附件路径
        path = ''
        var list = this.$refs.upload.fileList
        for (let i in list) {
          // 默认上传数据格式list[i].url；新上传数据格式list[i].response.data
          path += i === '0' ? (list[i].response && list[i].response.data) || list[i].url : ('|' + ((list[i].response && list[i].response.data) || list[i].url))
        }
      }
      // 回调函数，参数：1、附件名称；2、附件路径；3.序号；4、所有已上传数据list
      this.uploadCallback(name, path, this.index, this.$refs.upload.fileList)
    },
    uploadError () {
      this.$Message.error('上传失败!')
    },
    // 删除已上传文件
    removeList (file) {
      var path = ''
      var name = file.name
      // console.log(this.$refs.upload.fileList)
      if (this.multiple) {
        // 拼接未删除的附件路径
        var list = this.$refs.upload.fileList
        for (let i in list) {
          // 默认上传数据格式list[i].url；新上传数据格式list[i].response.data
          path += i === '0' ? (list[i].response && list[i].response.data) || list[i].url : ('|' + ((list[i].response && list[i].response.data) || list[i].url))
        }
      }
      // 回调函数，参数：1、当前删除附件名称；2、未删除的附件路径；3.序号；4、所有已上传数据list
      this.uploadCallback(name, path, this.index, this.$refs.upload.fileList)
    },
    // 上传文件格式错误时提示
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      })
    },
    // 上传文件超出大小限制时提示
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 100M。'
      })
    }
  }
}
</script>

