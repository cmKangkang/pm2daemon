import child_process from "node:child_process";
import path from "node:path";
import pino from "pino";
import pm2 from 'pm2'

const logger = pino();

class Deamon {
  // id: meta
  private _processes: Map<string | number, any>;

  // pm2 命名空间，可根据命名空间操作一组业务
  private _namespace: string;

  constructor(namespace: string = "plugins") {
    this._namespace = namespace;
    // this._execSync(`pm2 -v`)
    this.connect()
  }

  // private _execSync(code: string) {
  //   logger.info(`【sync exec】${code}`);
  //   return child_process.execSync(code)
  // }

  private _exec(code: string) {
    logger.info(`【exec】${code}`);
    return new Promise((resolve, reject) => {
      if (code.length === 0) {
        reject(new Error("code must not be empty"));
      }
      child_process.exec(code, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  connect() {
    pm2.connect((err) => { // 连接
      if (err) {
        logger.error(err.message)
        process.exit(2)
      }
      
      logger.info("pm2 connect success")

      pm2.launchBus((err, pm2Bus) => {
        if (err) {
          return logger.error(err.message)
        }
        logger.info("launch bus success")
        // 接收来自子进程的消息
        pm2Bus.on('process:msg', function (packet: any) {
          logger.info({
            type: "process:msg",
            msg: packet
          })
        })
      })
    })
  }

  disconnect() {
    pm2.disconnect()
  }

  private get _entryPath() {
    return path.join(__dirname, "..", "..", "plugins");
  }

  // 开启指定进程
  start(name: string) {
    return this._exec(
      `pm2 start --namespace ${this._namespace} --name ${name} ${this._entryPath}/${name}.js`
    );
  }

  apiStart(name: string) {
    return new Promise((resolve, reject) => {
      pm2.start({
        name,
        script: `${this._entryPath}/${name}.js`,
      }, async (err, data) => {
        if (err) {
          return reject(err)
        }
        const procs = data as pm2.Proc[]
        return resolve(procs)
      })
    })
  }

  // 获取进程元数据
  apiDesc(name: string): Promise<pm2.ProcessDescription[]> {
    return new Promise((resolve, reject) => {
      pm2.describe(name, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  // 关闭
  stop(name: string) {
    return this._exec(`pm2 stop ${name}`);
  }

  apiStop(name: string) {
    return new Promise((resolve, reject) => {
      pm2.stop(name, (err, procs) => {
        if (err) {
          return reject(err)
        }
        return resolve(procs)
      })
    })
  }

  // 关闭全部
  stopAll() {
    return this._exec(`pm2 stop --namespace ${this._namespace}`);
  }

  // 列表
  list() {
    const code = `pm2 list --namespace ${this._namespace}`;
    return this._exec(code);
  }

  // pm2 api list
  apiList() {
    return new Promise((resolve, reject) => {
      pm2.list((err, list) => {
        if (err) {
          return reject(err)
        }
        return resolve(list)
      })
    })
  }

  apiSendData(pm2id: number, topic: string | true = true, data: any) {
    return new Promise((resolve, reject) => {
      pm2.sendDataToProcessId(pm2id, {
        id: process.pid,
        type: "process:msg",
        data,
        topic
      }, (err, result) => {
        if (err) {
          return reject(err.message)
        }
        return resolve(result)
      })
    })
  }
}

const engine = new Deamon();

export default engine;
