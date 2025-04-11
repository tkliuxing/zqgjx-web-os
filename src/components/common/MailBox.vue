<template>
  <div>
    <el-badge
      v-if="unReadCount > 0"
      :value="unReadCount"
      class="item"
      type="danger"
      style="line-height: 30px; margin-right: 20px; border: none"
    >
      <el-button
        size="small"
        icon="el-icon-message-solid"
        style="background: #fff; color: #ff1627"
        round
        @click="
          () => {
            this.showMailBox = true;
            this.mailPage = 1;
            this.loadMailBox();
          }
        "
      >
        消息
      </el-button>
    </el-badge>
    <div
      v-else
      style="line-height: 30px; margin-right: 20px; border: none; display: inline-block;"
    >
      <el-button
        size="small"
        icon="el-icon-bell"
        style="background: #fff; color: #484848"
        round
        @click="
          () => {
            this.showMailBox = true;
            this.mailPage = 1;
            this.loadMailBox();
          }
        "
      >
        消息
      </el-button>
    </div>
    <el-dialog title="新消息提示" :visible.sync="showMailBox">
      <el-collapse accordion @change="readMail">
        <el-collapse-item v-for="mail in mails" :name="mail.pk" :key="mail.pk">
          <template slot="title">
            <div
              :style="{
                width: '96%',
                color: !mail.is_read ? '#2d8f6e' : 'inherit',
              }"
            >
              <i
                class="el-icon-chat-line-round"
                style="margin: 0 8px;font-size: 16px;"
              ></i
              >{{ mail.title }}
              <div style="font-size: 14px; float: right">
                {{ mail.is_read ? "" : "（未读）"
                }}{{ formatTheDate(mail.create_time) }}
              </div>
            </div>
          </template>
          <div style="margin: 0 34px;font-size: 16px">{{ mail.content }}</div>
          <el-button
            @click="deleteMail(mail)"
            type="danger"
            size="mini"
            plain
            circle
            icon="el-icon-delete"
            style="float: right;margin: 10px;"
          ></el-button>
        </el-collapse-item>
      </el-collapse>
      <div v-if="mails.length === 0" class="no-message">没有消息哦</div>
      <el-pagination
        background
        :hide-on-single-page="true"
        :total="mailTotal"
        :current-page.sync="mailPage"
        :page-size="mailPageSize"
        @current-change="loadMailBox"
        layout="prev, pager, next"
      >
      </el-pagination>
      <div style="text-align: center; margin:30px 0 10px 0">
        <el-button
          type="primary"
          round
          size="medium"
          @click="showMailBox = false"
          >我知道了~</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 消息提示，无参数
 */
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "MailBox",
  data() {
    return {
      showMailBox: false,
      unReadCount: 0,
      mailPage: 1,
      mailPageSize: 10,
      mailTotal: 0,
      mails: [],
    };
  },
  computed: {
    ...mapState(["userinfo"]),
  },
  methods: {
    async getUnReadCount() {
      let url = "/mailbox-unread-count/";
      try {
        let resp = await this.$http.get(url);
        this.unReadCount = resp.data.count;
      } catch (error) {
        return error;
      }
    },
    async loadMailBox() {
      let url = "/mailbox/";
      let params = {
        user_id: this.userinfo.pk,
        page: this.mailPage,
        pageSize: this.mailPageSize,
      };
      try {
        let resp = await this.$http.get(url, { params });
        this.mails = resp.data.data;
        this.mailTotal = resp.data.count;
      } catch (error) {
        return error;
      }
    },
    readMail(pk) {
      if (!!pk) {
        this.$http.patch(`/mailbox/${pk}/`, { is_read: true }).then((resp) => {
          for (let i = 0; i < this.mails.length; i++) {
            let mail = this.mails[i];
            if (mail.pk == pk) {
              mail.is_read = true;
              break;
            }
          }
          this.unReadCount -= 1;
          return pk;
        });
      }
    },
    deleteMail(mail) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http
          .delete(`/mailbox/${mail.pk}/`)
          .then(() => {
            this.$message.success("删除成功！");
            this.loadMailBox();
          })
          .catch(() => {
            this.$message.warning("网络出了些问题，请稍候重试");
          });
      });
    },
    formatTheDate(date) {
      if (date) {
        return moment(date).format("YYYY-MM-DD HH:mm");
      } else {
        return "-";
      }
    },
  },
  mounted() {
    this.getUnReadCount();
    this.readInterview = setInterval(() => {
      this.getUnReadCount();
    }, 1000 * 30);
  },
  beforeDestroy() {
    clearInterval(this.readInterview);
  },
};
</script>

<style scoped>
.no-message {
  text-align: center;
  padding: 20px;
  border-bottom: 2px solid #ebeef5;
}
</style>
