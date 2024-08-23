import TraceKit from 'tracekit';
import { uploadVueError, uploadWindowError } from '@/api/system';
import dayjs from 'dayjs';

export const UseVueError = (app) => {
  TraceKit.report.subscribe((error) => {
    const { message, stack } = error || {}

    const obj = {
      message,
      stack: {
        column: stack[0].column,
        line: stack[0].line,
        func: stack[0].func,
        url: stack[0].url
      }
    }

    uploadVueError({
      error: obj,
      data: {
        errTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent), // 是否移动端
        isWechat: /MicroMessenger/i.test(navigator.userAgent), // 微信浏览器
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, // 两个都是false就是未知设备
        isAndroid: /Android/.test(navigator.userAgent) && !/Windows Phone/.test(navigator.userAgent)
      },
      browserInfo: {
        userAgent: navigator.userAgent,
        protcol: window.location.protocol
      }
    }).then(() => {
      console.log('错误上报成功');
    }).catch(() => {
      console.log('错误上报失败');
    })

  })

  app.config.errorHandler = (err, vm, info) => {
    TraceKit.report(err)
  }
}

// 资源加载错误上报
export const UseWindowError = () => {
  window.addEventListener('error', args => {
    const err = args.target.src || args.target.href
    const obj = {
      message: '加载异常' + err
    }

    if (!err) {
      return true
    }

    uploadWindowError({
      error: obj,
      data: {
        errTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), // 是否移动端
        isWechat: /MicroMessenger/i.test(navigator.userAgent), // 是否微信浏览器
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, // 两个都是false就是未知设备
        isAndroid: /Android/.test(navigator.userAgent) && !/Windows Phone/.test(navigator.userAgent)
      },
      browserInfo: {
        userAgent: navigator.userAgent,
        protcol: protcol
      }
    }).then(() => {
      console.log('错误上报成功');
    }).catch(() => {
      console.log('错误上报失败');
    });
    return true
  }, true)
}