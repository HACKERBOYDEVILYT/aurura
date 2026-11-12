package com.arura.streaming

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.os.Bundle
import android.view.View
import android.webkit.*
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private val appUrl = "https://arura.tv" // Production URL or local webview bundle

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Window setup for dark cinematic theme
        window.statusBarColor = android.graphics.Color.parseColor("#090B10")
        window.navigationBarColor = android.graphics.Color.parseColor("#090B10")

        swipeRefresh = SwipeRefreshLayout(this).apply {
            setColorSchemeColors(android.graphics.Color.parseColor("#7C4DFF"))
            setProgressBackgroundColorSchemeColor(android.graphics.Color.parseColor("#171B26"))
        }

        webView = WebView(this).apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                mediaPlaybackRequiresUserGesture = false
                allowFileAccess = true
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                cacheMode = WebSettings.LOAD_DEFAULT
                useWideViewPort = true
                loadWithOverviewMode = true
            }

            webViewClient = object : WebViewClient() {
                override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                    swipeRefresh.isRefreshing = true
                }

                override fun onPageFinished(view: WebView?, url: String?) {
                    swipeRefresh.isRefreshing = false
                }
            }

            webChromeClient = object : WebChromeClient() {
                override fun onProgressChanged(view: WebView?, newProgress: Int) {
                    if (newProgress >= 90) {
                        swipeRefresh.isRefreshing = false
                    }
                }
            }

            setBackgroundColor(android.graphics.Color.parseColor("#090B10"))
        }

        swipeRefresh.addView(webView)
        swipeRefresh.setOnRefreshListener {
            webView.reload()
        }

        setContentView(swipeRefresh)

        // Load Arura streaming client
        webView.loadUrl(appUrl)

        // Handle modern back navigation
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
